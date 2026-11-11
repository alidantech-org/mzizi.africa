ALTER TABLE geography.country_territories DROP CONSTRAINT country_territories_relation_kind_check;
ALTER TABLE geography.country_territories ADD CONSTRAINT country_territories_relation_kind_check
  CHECK (relation_kind IN ('core','claimed','administered','statistical_area'));
COMMENT ON COLUMN geography.country_territories.relation_kind IS 'statistical_area links an AU country identity to a UN M49 area code without asserting sovereignty, legal territory or a boundary. Other kinds require their own source review.';
