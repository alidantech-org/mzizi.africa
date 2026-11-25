import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'motion_votes.g.dart';

/// Motion Votes
@JsonSerializable(includeIfNull: false)
class LegislatureMotionVotes {
  const LegislatureMotionVotes({required this.countryId, this.limit, required this.motionId, this.offset});
  final String countryId;
  final int? limit;
  final String motionId;
  final int? offset;

  factory LegislatureMotionVotes.fromJson(Map<String, dynamic> json) => _$LegislatureMotionVotesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureMotionVotesToJson(this);
}
