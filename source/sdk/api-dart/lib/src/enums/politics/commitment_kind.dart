import 'package:json_annotation/json_annotation.dart';

/// Commitment Kind
enum PoliticsCommitmentKind {
  @JsonValue('campaign-promise')
  campaignPromise,
  @JsonValue('manifesto-pledge')
  manifestoPledge,
  @JsonValue('office-pledge')
  officePledge,
}
