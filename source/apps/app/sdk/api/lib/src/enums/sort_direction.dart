import 'package:json_annotation/json_annotation.dart';

/// Sort Direction
enum SortDirection {
  @JsonValue('asc')
  ascending,
  @JsonValue('desc')
  descending;
}