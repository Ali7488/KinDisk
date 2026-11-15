-- ============================================================
-- KINDISK DEVELOPMENT SEED
-- 3 users, 1 settings row, 51 folders, 22 file records
--
-- Run after resetting the development database.
-- File records contain FAKE storage keys, not real disk files.
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

-- Fixed UUID for the development user, so Postman tests survive database reseeds.
-- This is a local test identity, NOT a valid authenticated session.
INSERT INTO public.users (
    user_id,
    username,
    password_hash,
    quota_override_bytes
)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'Mohannad', '!LOCAL_DEV_LOGIN_DISABLED!', NULL),
    (DEFAULT, 'Marah',  '!LOCAL_DEV_LOGIN_DISABLED!', 110000000000),
    (DEFAULT, 'Ammar',  '!LOCAL_DEV_LOGIN_DISABLED!', NULL);


-- ============================================================
-- 2. INSTANCE SETTINGS
-- ============================================================

INSERT INTO public.settings (
    settings_id,
    owner_user_id,
    total_storage,
    single_upload_limit
)
VALUES (
    1,
    (SELECT user_id
     FROM public.users
     WHERE username = 'Mohannad'),
    300000000000,
    512000000
);


-- ============================================================
-- 3. ROOT FOLDERS (12)
-- ============================================================

INSERT INTO public.folders (
    owned_by,
    parent_folder_id,
    folder_name
)
SELECT
    u.user_id,
    NULL,
    v.folder_name
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
JOIN public.users AS u
    ON u.username = v.username;


-- ============================================================
-- 4. CHILD FOLDERS (24)
-- ============================================================

INSERT INTO public.folders (
    owned_by,
    parent_folder_id,
    folder_name
)
SELECT
    u.user_id,
    parent.folder_id,
    v.folder_name
FROM (
    VALUES
        -- Mohannad
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

        -- Marah
        ('Marah', 'University', 'Pharmaceutics'),
        ('Marah', 'University', 'Biochemistry'),
        ('Marah', 'Work', 'Reports'),
        ('Marah', 'Work', 'Templates'),
        ('Marah', 'Personal', 'Photos'),
        ('Marah', 'Personal', 'Notes'),
        ('Marah', 'Shared', 'Family'),

        -- Ammar
        ('Ammar', 'Games', 'Saves'),
        ('Ammar', 'Games', 'Screenshots'),
        ('Ammar', 'Work', 'Projects'),
        ('Ammar', 'Work', 'Invoices'),
        ('Ammar', 'Personal', 'Downloads'),
        ('Ammar', 'Personal', 'Photos'),
        ('Ammar', 'Archive', 'Backups')
) AS v(username, parent_name, folder_name)
JOIN public.users AS u
    ON u.username = v.username
JOIN public.folders AS parent
    ON parent.owned_by = u.user_id
   AND parent.folder_name = v.parent_name
   AND parent.parent_folder_id IS NULL;


-- ============================================================
-- 5. GRANDCHILD FOLDERS (15)
-- ============================================================

INSERT INTO public.folders (
    owned_by,
    parent_folder_id,
    folder_name
)
SELECT
    u.user_id,
    parent.folder_id,
    v.folder_name
FROM (
    VALUES
        -- Mohannad
        ('Mohannad', 'University', 'CS340', 'Assignments'),
        ('Mohannad', 'University', 'CS340', 'Notes'),
        ('Mohannad', 'University', 'MATH221', 'Practice'),
        ('Mohannad', 'Projects', 'KinDisk', 'Backend'),
        ('Mohannad', 'Projects', 'KinDisk', 'Frontend'),
        ('Mohannad', 'Personal', 'Photos', 'Trips'),

        -- Marah
        ('Marah', 'University', 'Pharmaceutics', 'Lectures'),
        ('Marah', 'University', 'Pharmaceutics', 'Past Exams'),
        ('Marah', 'Work', 'Reports', '2026'),
        ('Marah', 'Shared', 'Family', 'Photos'),

        -- Ammar
        ('Ammar', 'Games', 'Saves', 'RPG'),
        ('Ammar', 'Games', 'Screenshots', '2026'),
        ('Ammar', 'Work', 'Projects', 'Current'),
        ('Ammar', 'Archive', 'Backups', '2025'),
        ('Ammar', 'Personal', 'Downloads', 'Installers')
) AS v(username, root_name, parent_name, folder_name)
JOIN public.users AS u
    ON u.username = v.username
JOIN public.folders AS root
    ON root.owned_by = u.user_id
   AND root.folder_name = v.root_name
   AND root.parent_folder_id IS NULL
JOIN public.folders AS parent
    ON parent.owned_by = u.user_id
   AND parent.parent_folder_id = root.folder_id
   AND parent.folder_name = v.parent_name;


-- ============================================================
-- 6. FILE METADATA (22)
-- ============================================================
-- Resolve file folder paths to their generated UUIDs.
-- Fail if a folder is missing or the path is ambiguous.
--
-- These are DATABASE-ONLY files.
-- No physical file content is created.
-- ============================================================

DO $seed$
DECLARE
    file_entry RECORD;
    user_uuid UUID;
    target_folder_uuid UUID;
BEGIN
    FOR file_entry IN
        SELECT *
        FROM (
            VALUES
                -- MOHANNAD: Root files
                (
                    'Mohannad',
                    NULL::TEXT,
                    'welcome.txt',
                    1200::BIGINT,
                    'text/plain',
                    'dev/mohannad/welcome'
                ),
                (
                    'Mohannad',
                    NULL,
                    'empty.txt',
                    0,
                    'text/plain',
                    'dev/mohannad/empty'
                ),

                -- MOHANNAD: University
                (
                    'Mohannad',
                    'University/CS340',
                    'lecture-01.pdf',
                    520000,
                    'application/pdf',
                    'dev/mohannad/lecture01'
                ),
                (
                    'Mohannad',
                    'University/CS340/Assignments',
                    'assignment-1.pdf',
                    825000,
                    'application/pdf',
                    'dev/mohannad/assignment1'
                ),
                (
                    'Mohannad',
                    'University/CS340/Assignments',
                    'solution.ts',
                    3400,
                    'text/plain',
                    'dev/mohannad/solution'
                ),
                (
                    'Mohannad',
                    'University/MATH221/Practice',
                    'congruences.pdf',
                    216000,
                    'application/pdf',
                    'dev/mohannad/congruences'
                ),

                -- MOHANNAD: Projects
                (
                    'Mohannad',
                    'Projects/KinDisk/Backend',
                    'db.js',
                    1320,
                    'text/javascript',
                    'dev/mohannad/dbjs'
                ),
                (
                    'Mohannad',
                    'Projects/KinDisk/Backend',
                    'queries.sql',
                    2880,
                    'application/sql',
                    'dev/mohannad/queries'
                ),
                (
                    'Mohannad',
                    'Projects/KinDisk/Frontend',
                    'App.tsx',
                    1450,
                    'text/plain',
                    'dev/mohannad/apptsx'
                ),
                (
                    'Mohannad',
                    'Projects/Consistra',
                    'README.md',
                    5500,
                    'text/markdown',
                    'dev/mohannad/consistra-readme'
                ),

                -- MOHANNAD: Personal
                (
                    'Mohannad',
                    'Personal/Photos/Trips',
                    'mountains.jpg',
                    4200000,
                    'image/jpeg',
                    'dev/mohannad/mountains'
                ),
                (
                    'Mohannad',
                    'Personal/Documents',
                    'resume.pdf',
                    340000,
                    'application/pdf',
                    'dev/mohannad/resume'
                ),

                -- MARAH: Root file
                (
                    'Marah',
                    NULL,
                    'todo.md',
                    900,
                    'text/markdown',
                    'dev/marah/todo'
                ),

                -- MARAH: University
                (
                    'Marah',
                    'University/Pharmaceutics/Lectures',
                    'lecture-01.pdf',
                    1800000,
                    'application/pdf',
                    'dev/marah/lecture01'
                ),
                (
                    'Marah',
                    'University/Pharmaceutics/Lectures',
                    'lecture-02.pdf',
                    2200000,
                    'application/pdf',
                    'dev/marah/lecture02'
                ),
                (
                    'Marah',
                    'University/Pharmaceutics/Past Exams',
                    'midterm.pdf',
                    630000,
                    'application/pdf',
                    'dev/marah/midterm'
                ),

                -- MARAH: Work and Shared
                (
                    'Marah',
                    'Work/Reports/2026',
                    'report.xlsx',
                    180000,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'dev/marah/report'
                ),
                (
                    'Marah',
                    'Shared/Family/Photos',
                    'family.png',
                    3800000,
                    'image/png',
                    'dev/marah/family'
                ),

                -- AMMAR: Root file
                (
                    'Ammar',
                    NULL,
                    'readme.txt',
                    700,
                    'text/plain',
                    'dev/ammar/readme'
                ),

                -- AMMAR: Games
                (
                    'Ammar',
                    'Games/Saves/RPG',
                    'save-01.dat',
                    12000000,
                    NULL,
                    'dev/ammar/save01'
                ),
                (
                    'Ammar',
                    'Games/Screenshots/2026',
                    'victory.png',
                    2400000,
                    'image/png',
                    'dev/ammar/victory'
                ),

                -- AMMAR: Archive
                (
                    'Ammar',
                    'Archive/Backups/2025',
                    'backup.tar.gz',
                    45000000,
                    'application/gzip',
                    'dev/ammar/backup'
                )

        ) AS v(
            username,
            folder_path,
            original_name,
            size_bytes,
            mime_type,
            storage_key
        )
    LOOP
        -- Find the owner's UUID.
        SELECT user_id
        INTO STRICT user_uuid
        FROM public.users
        WHERE username = file_entry.username;

        -- NULL means the file belongs at the drive root.
        target_folder_uuid := NULL;

        IF file_entry.folder_path IS NOT NULL THEN

            -- Reconstruct full paths from parent-folder links.
            WITH RECURSIVE folder_paths AS (
                SELECT
                    folder_id,
                    owned_by,
                    folder_name::TEXT AS full_path
                FROM public.folders
                WHERE parent_folder_id IS NULL

                UNION ALL

                SELECT
                    child.folder_id,
                    child.owned_by,
                    parent.full_path || '/' || child.folder_name
                FROM public.folders AS child
                JOIN folder_paths AS parent
                    ON child.parent_folder_id = parent.folder_id
                   AND child.owned_by = parent.owned_by
            )
            SELECT folder_id
            INTO STRICT target_folder_uuid
            FROM folder_paths
            WHERE owned_by = user_uuid
              AND full_path = file_entry.folder_path;

        END IF;

        INSERT INTO public.files (
            folder_id,
            owner_id,
            created_by,
            storage_key,
            original_name,
            size_bytes,
            mime_type
        )
        VALUES (
            target_folder_uuid,
            user_uuid,
            user_uuid,
            file_entry.storage_key,
            file_entry.original_name,
            file_entry.size_bytes,
            file_entry.mime_type
        )
        ON CONFLICT (storage_key) DO NOTHING;

    END LOOP;
END
$seed$;


-- ============================================================
-- 7. VERIFY SEEDED DATA
-- ============================================================

SELECT
    'users' AS entity,
    COUNT(*) AS total
FROM public.users

UNION ALL

SELECT
    'folders',
    COUNT(*)
FROM public.folders

UNION ALL

SELECT
    'files',
    COUNT(*)
FROM public.files

UNION ALL

SELECT
    'settings',
    COUNT(*)
FROM public.settings;
