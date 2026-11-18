import 'package:json_annotation/json_annotation.dart';

part 'election_detail.g.dart';

/// Election Detail
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetail {
  const InsightsElectionDetail({required this.contests, required this.election, required this.gaps, required this.totals, required this.units});
  final List<Object?> contests;
  final Object? election;
  final List<String> gaps;
  final List<Object?> totals;
  final List<Object?> units;

  factory InsightsElectionDetail.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailToJson(this);
}
