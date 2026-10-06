-- =============================================================================
-- Migration: Update `leads` table for UK Damp & Mould Risk Explorer
-- Ticket value: £350–£800 (Damp & Timber Survey) / £1,500–£4,000 (Remediation)
-- =============================================================================

-- 1. Relax or update service_needed constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_service_needed_check;

ALTER TABLE public.leads ADD CONSTRAINT leads_service_needed_check 
  CHECK (service_needed IN (
    'damp_timber_survey',
    'condensation_mould',
    'rising_penetrating',
    'full_property_audit',
    'water_softener',
    'boiler_protection',
    'drinking_filter',
    'both'
  ));

-- 2. Add damp_risk_score if not present
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS damp_risk_score NUMERIC;

-- 3. Comments for documentation
COMMENT ON TABLE public.leads IS 'Qualified homeowner leads for independent damp surveys, timber reports, and condensation audits in the UK.';
COMMENT ON COLUMN public.leads.damp_risk_score IS 'Local Damp Risk Score (0-100) at time of lead submission.';
COMMENT ON COLUMN public.leads.service_needed IS 'Survey service requested (damp_timber_survey, condensation_mould, rising_penetrating, full_property_audit).';
