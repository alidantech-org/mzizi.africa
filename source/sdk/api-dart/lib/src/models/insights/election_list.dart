import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/election_list_elections.dart';

part 'election_list.g.dart';

/// Election List
@JsonSerializable(includeIfNull: false)
class InsightsElectionList {
  const InsightsElectionList({required this.elections});
  final List<InsightsElectionListElections> elections;

  factory InsightsElectionList.fromJson(Map<String, dynamic> json) => _$InsightsElectionListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionListToJson(this);
}
