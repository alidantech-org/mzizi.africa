import 'package:json_annotation/json_annotation.dart';

/// Http Method
enum SourceHttpMethod {
  @JsonValue('GET')
  getValue,
  @JsonValue('HEAD')
  head,
  @JsonValue('POST')
  post,
}
