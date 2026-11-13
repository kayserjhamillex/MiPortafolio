from sqlalchemy import CheckConstraint, Column, Integer, MetaData, String, Table, Text, create_engine

metadata = MetaData()
records = Table(
    "studio_records", metadata,
    Column("id", String(36), primary_key=True),
    Column("kind", String(20), nullable=False),
    Column("title", String(90), nullable=False),
    Column("summary", Text, nullable=False),
    Column("contact_name", String(100)),
    Column("contact_email", String(254)),
    Column("created_at", String(40), nullable=False),
    CheckConstraint("kind IN ('drafts', 'inquiries', 'resources')", name="studio_record_kind"),
)
sessions = Table(
    "admin_sessions", metadata,
    Column("token_hash", String(64), primary_key=True),
    Column("generation", String(64), nullable=False),
    Column("expires_at", Integer, nullable=False),
)
limits = Table(
    "request_limits", metadata,
    Column("key", String(64), primary_key=True),
    Column("window_start", Integer, nullable=False),
    Column("hits", Integer, nullable=False),
)


def make_engine(url):
    options = {"pool_pre_ping": True}
    if str(url).startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
    return create_engine(url, **options)
