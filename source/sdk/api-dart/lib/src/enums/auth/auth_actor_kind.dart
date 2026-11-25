import 'package:json_annotation/json_annotation.dart';

/// Auth Actor Kind
enum AuthAuthActorKind {
  @JsonValue('agent')
  agent,
  @JsonValue('person')
  person,
  @JsonValue('service')
  service,
}
