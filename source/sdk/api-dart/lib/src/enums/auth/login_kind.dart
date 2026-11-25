import 'package:json_annotation/json_annotation.dart';

/// Login Kind
enum AuthLoginKind {
  @JsonValue('email')
  email,
  @JsonValue('oidc')
  oidc,
  @JsonValue('phone')
  phone,
}
