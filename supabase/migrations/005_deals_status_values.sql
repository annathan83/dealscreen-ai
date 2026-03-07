alter table public.deals
  drop constraint if exists deals_status_check;

alter table public.deals
  add constraint deals_status_check check (
    status is null
    or status in (
      'new',
      'nda requested',
      'cim received',
      'loi negotiations',
      'loi signed',
      'due diligence',
      'closed',
      'canceled'
    )
  );
