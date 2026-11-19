import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/party_list_parties.dart';

part 'party_list.g.dart';

/// Party List
@JsonSerializable(includeIfNull: false)
class InsightsPartyList {
  const InsightsPartyList({required this.gaps, required this.parties});
  final List<String> gaps;
  final List<InsightsPartyListParties> parties;

  factory InsightsPartyList.fromJson(Map<String, dynamic> json) => _$InsightsPartyListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyListToJson(this);
}
