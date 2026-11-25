import 'package:json_annotation/json_annotation.dart';

/// Vote Choice
enum LegislatureVoteChoice {
  @JsonValue('absent')
  absent,
  @JsonValue('abstain')
  abstain,
  @JsonValue('no')
  no,
  @JsonValue('yes')
  yes,
}
