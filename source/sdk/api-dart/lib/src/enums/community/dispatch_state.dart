import 'package:json_annotation/json_annotation.dart';

/// Dispatch State
enum CommunityDispatchState {
  @JsonValue('failed')
  failed,
  @JsonValue('opened')
  opened,
  @JsonValue('queued')
  queued,
  @JsonValue('sent')
  sent,
}
