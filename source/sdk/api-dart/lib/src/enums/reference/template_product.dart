import 'package:json_annotation/json_annotation.dart';

/// Template Product
enum ReferenceTemplateProduct {
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
