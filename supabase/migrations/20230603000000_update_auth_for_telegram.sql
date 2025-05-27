-- Обновляем политики безопасности для использования telegram_id
ALTER POLICY "Users can view their own profile" ON profiles
USING (telegram_id::text = current_setting('request.jwt.claims')::json->>'telegram_id');

ALTER POLICY "Users can update their own profile" ON profiles
USING (telegram_id::text = current_setting('request.jwt.claims')::json->>'telegram_id');

-- Создаем новую политику для вставки профилей
CREATE POLICY "Anyone can insert a profile" ON profiles FOR INSERT
WITH CHECK (true);

-- Обновляем политики для других таблиц
ALTER POLICY "Users can view their own task completions" ON user_tasks
USING (user_id IN (SELECT id FROM profiles WHERE telegram_id::text = current_setting('request.jwt.claims')::json->>'telegram_id'));

ALTER POLICY "Users can complete tasks" ON user_tasks
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE telegram_id::text = current_setting('request.jwt.claims')::json->>'telegram_id'));

ALTER POLICY "Users can view their referrals" ON referrals
USING (referrer_id IN (SELECT id FROM profiles WHERE telegram_id::text = current_setting('request.jwt.claims')::json->>'telegram_id'));

-- Создаем функцию для аутентификации Telegram пользователей
CREATE OR REPLACE FUNCTION authenticate_telegram_user(telegram_id TEXT, first_name TEXT, last_name TEXT, username TEXT)
RETURNS jwt_token AS $$
DECLARE
  user_id UUID;
  result jwt_token;
BEGIN
  -- Попытка найти существующего пользователя
  SELECT id INTO user_id FROM profiles WHERE profiles.telegram_id = authenticate_telegram_user.telegram_id;
  
  -- Если пользователь не найден, создаем нового
  IF user_id IS NULL THEN
    INSERT INTO profiles (telegram_id, full_name, username)
    VALUES (authenticate_telegram_user.telegram_id, 
            concat(authenticate_telegram_user.first_name, ' ', authenticate_telegram_user.last_name),
            authenticate_telegram_user.username)
    RETURNING id INTO user_id;
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
