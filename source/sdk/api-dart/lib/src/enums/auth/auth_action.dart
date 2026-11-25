import 'package:json_annotation/json_annotation.dart';

/// Auth Action
enum AuthAuthAction {
  @JsonValue('admin')
  admin,
  @JsonValue('create')
  create,
  @JsonValue('delete')
  delete,
  @JsonValue('export')
  exportValue,
  @JsonValue('publish')
  publish,
  @JsonValue('read')
  read,
  @JsonValue('review')
  review,
  @JsonValue('update')
  update,
}
