import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/election_detail_contests.dart';
import 'package:mzizi_api/src/models/insights/election_detail_election.dart';
import 'package:mzizi_api/src/models/insights/election_detail_totals.dart';
import 'package:mzizi_api/src/models/insights/election_detail_units.dart';

part 'election_detail.g.dart';

/// Election Detail
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetail {
  const InsightsElectionDetail({required this.contests, required this.election, required this.gaps, required this.totals, required this.units});
  final List<InsightsElectionDetailContests> contests;
  final InsightsElectionDetailElection election;
  final List<String> gaps;
  final List<InsightsElectionDetailTotals> totals;
  final List<InsightsElectionDetailUnits> units;

  factory InsightsElectionDetail.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailToJson(this);
}
