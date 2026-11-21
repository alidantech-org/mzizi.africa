import 'package:json_annotation/json_annotation.dart';

/// Boundary Mode
enum ExplorerBoundaryMode {
  @JsonValue('children')
  children,
  @JsonValue('self')
  self,
}
