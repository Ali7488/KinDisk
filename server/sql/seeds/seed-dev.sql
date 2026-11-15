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
INSERT INTO public.folders (owned_by, parent_folder_id, folder_name)
SELECT u.user_id, NULL, v.folder_name
FROM (
    VALUES
        ('Mohannad', 'University'),
        ('Mohannad', 'Projects'),
        ('Mohannad', 'Personal'),
        ('Mohannad', 'Archive'),

        ('Marah', 'University'),
        ('Marah', 'Work'),
        ('Marah', 'Personal'),
        ('Marah', 'Shared'),

        ('Ammar', 'Games'),
        ('Ammar', 'Work'),
        ('Ammar', 'Personal'),
        ('Ammar', 'Archive')
) AS v(username, folder_name)
JOIN public.users u ON u.username = v.username;

INSERT INTO public.folders (owned_by, parent_folder_id, folder_name)
SELECT u.user_id, NULL, v.folder_name
FROM (
    VALUES
        ('Mohannad', 'University'),
        ('Mohannad', 'Projects'),
        ('Mohannad', 'Personal'),
        ('Mohannad', 'Archive'),

        ('Marah', 'University'),
        ('Marah', 'Work'),
        ('Marah', 'Personal'),
        ('Marah', 'Shared'),

        ('Ammar', 'Games'),
        ('Ammar', 'Work'),
        ('Ammar', 'Personal'),
        ('Ammar', 'Archive')
) AS v(username, folder_name)
JOIN public.users u ON u.username = v.username;
INSERT INTO public.folders (owned_by, parent_folder_id, folder_name)
SELECT u.user_id, parent.folder_id, v.folder_name
FROM (
    VALUES
        ('Mohannad', 'University', 'CS340'),
        ('Mohannad', 'University', 'CS285'),
        ('Mohannad', 'University', 'MATH221'),
        ('Mohannad', 'University', 'CHEM104'),
        ('Mohannad', 'Projects', 'KinDisk'),
        ('Mohannad', 'Projects', 'Consistra'),
        ('Mohannad', 'Projects', 'Portfolio'),
        ('Mohannad', 'Personal', 'Documents'),
        ('Mohannad', 'Personal', 'Photos'),
        ('Mohannad', 'Archive', 'Old Projects'),

        ('Marah', 'University', 'Pharmaceutics'),
        ('Marah', 'University', 'Biochemistry'),
        ('Marah', 'Work', 'Reports'),
        ('Marah', 'Work', 'Templates'),
        ('Marah', 'Personal', 'Photos'),
        ('Marah', 'Personal', 'Notes'),
        ('Marah', 'Shared', 'Family'),

        ('Ammar', 'Games', 'Saves'),
        ('Ammar', 'Games', 'Screenshots'),
        ('Ammar', 'Work', 'Projects'),
        ('Ammar', 'Work', 'Invoices'),
        ('Ammar', 'Personal', 'Downloads'),
        ('Ammar', 'Personal', 'Photos'),
        ('Ammar', 'Archive', 'Backups')
) AS v(username, parent_name, folder_name)
JOIN public.users u
    ON u.username = v.username
JOIN public.folders parent
    ON parent.owned_by = u.user_id
    AND parent.folder_name = v.parent_name
    AND parent.parent_folder_id IS NULL;
INSERT INTO public.folders (owned_by, parent_folder_id, folder_name)
SELECT u.user_id, parent.folder_id, v.folder_name
FROM (
    VALUES
        ('Mohannad', 'University', 'CS340', 'Assignments'),
        ('Mohannad', 'University', 'CS340', 'Notes'),
        ('Mohannad', 'University', 'MATH221', 'Practice'),
        ('Mohannad', 'Projects', 'KinDisk', 'Backend'),
        ('Mohannad', 'Projects', 'KinDisk', 'Frontend'),
        ('Mohannad', 'Personal', 'Photos', 'Trips'),

        ('Marah', 'University', 'Pharmaceutics', 'Lectures'),
        ('Marah', 'University', 'Pharmaceutics', 'Past Exams'),
        ('Marah', 'Work', 'Reports', '2026'),
        ('Marah', 'Shared', 'Family', 'Photos'),

        ('Ammar', 'Games', 'Saves', 'RPG'),
        ('Ammar', 'Games', 'Screenshots', '2026'),
        ('Ammar', 'Work', 'Projects', 'Current'),
        ('Ammar', 'Archive', 'Backups', '2025'),
        ('Ammar', 'Personal', 'Downloads', 'Installers')
) AS v(username, root_name, parent_name, folder_name)
JOIN public.users u
    ON u.username = v.username
JOIN public.folders root
    ON root.owned_by = u.user_id
    AND root.folder_name = v.root_name
    AND root.parent_folder_id IS NULL
JOIN public.folders parent
    ON parent.owned_by = u.user_id
    AND parent.parent_folder_id = root.folder_id
    AND parent.folder_name = v.parent_name;
