import 'package:json_annotation/json_annotation.dart';

/// Template Product
enum GovernanceTemplateProduct {
  @JsonValue('contact')
  contact,
  @JsonValue('domain')
  domain,
  @JsonValue('event-rule')
  eventRule,
  @JsonValue('institution')
  institution,
  @JsonValue('office')
  office,
  @JsonValue('position')
  position,
}
