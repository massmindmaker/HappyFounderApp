-- Добавляем колонку для реферального кода и баланса токенов
ALTER TABLE profiles
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN token_balance DECIMAL(10, 2) DEFAULT 0;

-- Добавляем колонку для хранения информации о том, кто пригласил пользователя
ALTER TABLE profiles
ADD COLUMN referred_by UUID REFERENCES profiles(id);

-- Создаем функцию для генерации уникального реферального кода
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Обновляем функцию authenticate_telegram_user для генерации реферального кода
CREATE OR REPLACE FUNCTION authenticate_telegram_user(telegram_id TEXT, first_name TEXT, last_name TEXT, username TEXT, referral_code TEXT DEFAULT NULL)
RETURNS jwt_token AS $$
DECLARE
  user_id UUID;
  ref_user_id UUID;
  new_referral_code TEXT;
  result jwt_token;
BEGIN
  -- Попытка найти существующего пользователя
  SELECT id INTO user_id FROM profiles WHERE profiles.telegram_id = authenticate_telegram_user.telegram_id;
  
  -- Если пользователь не найден, создаем нового
  IF user_id IS NULL THEN
    -- Генерируем уникальный реферальный код
    new_referral_code := generate_referral_code();
    WHILE EXISTS (SELECT 1 FROM profiles WHERE referral_code = new_referral_code) LOOP
      new_referral_code := generate_referral_code();
    END LOOP;

    -- Находим пользователя, который пригласил нового пользователя (если есть)
    IF referral_code IS NOT NULL THEN
      SELECT id INTO ref_user_id FROM profiles WHERE referral_code = authenticate_telegram_user.referral_code;
    END IF;

    INSERT INTO profiles (telegram_id, full_name, username, referral_code, referred_by)
    VALUES (
      authenticate_telegram_user.telegram_id, 
      concat(authenticate_telegram_user.first_name, ' ', authenticate_telegram_user.last_name),
      authenticate_telegram_user.username,
      new_referral_code,
      ref_user_id
    )
    RETURNING id INTO user_id;

    -- Если пользователь был приглашен, начисляем токены пригласившему
    IF ref_user_id IS NOT NULL THEN
      UPDATE profiles SET token_balance = token_balance + 100 WHERE id = ref_user_id;
    END IF;
  END IF;

  -- Создаем и возвращаем JWT токен
  SELECT sign(
    row_to_json(r), current_setting('app.jwt_secret')
  ) AS token
  FROM (
    SELECT 
      'authenticated' AS role,
      user_id AS user_id,
      authenticate_telegram_user.telegram_id AS telegram_id,
      extract(epoch from now())::integer + (60*60) AS exp
  ) r
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Добавляем админправа для пользователя @b0brov
UPDATE profiles
SET is_admin = true
WHERE username = 'b0brov';

