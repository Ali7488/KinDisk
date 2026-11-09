DO $$
BEGIN
    IF current_database() <> 'kindisk_dev' THEN
        RAISE EXCEPTION 'Refusing to clear a non-development database';
    END IF;
END
$$;

TRUNCATE TABLE
    public.folderaccess,
    public.files,
    public.folders,
    public.settings,
    public.users
RESTART IDENTITY;
