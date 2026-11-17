import 'package:json_annotation/json_annotation.dart';

/// Sort Direction
enum SharedSortDirection {
  @JsonValue('asc')
  ascending,
  @JsonValue('desc')
  descending,
}
