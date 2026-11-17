import 'package:json_annotation/json_annotation.dart';

/// Access
enum FilesystemAccess {
  @JsonValue('internal')
  internal,
  @JsonValue('private')
  private,
  @JsonValue('public')
  public,
  @JsonValue('restricted')
  restricted,
}
