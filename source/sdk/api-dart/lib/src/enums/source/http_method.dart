import 'package:json_annotation/json_annotation.dart';

/// Http Method
enum SourceHttpMethod {
  @JsonValue('GET')
  get,
  @JsonValue('HEAD')
  head,
  @JsonValue('POST')
  post,
}
