import 'package:json_annotation/json_annotation.dart';

/// Resolution Status
enum ExplorerResolutionStatus {
  @JsonValue('ambiguous')
  ambiguous,
  @JsonValue('matched')
  matched,
  @JsonValue('unresolved')
  unresolved,
}
