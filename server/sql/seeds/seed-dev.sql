INSERT INTO public.users (username, password_hash, quota_override_bytes)
VALUES
    ('Mohannad', '!LOCAL_DEV_LOGIN_DISABLED!', NULL),
    ('Marah',    '!LOCAL_DEV_LOGIN_DISABLED!', 110000000000),
    ('Ammar',    '!LOCAL_DEV_LOGIN_DISABLED!', NULL);

INSERT INTO public.settings (settings_id, owner_user_id, total_storage, single_upload_limit)
VALUES (
    1,
    (SELECT user_id FROM public.users WHERE username = 'Mohannad'),
    300000000000,
    512000000
);
