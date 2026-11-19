import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/party_detail_funding.dart';
import 'package:mzizi_api/src/models/insights/party_detail_members.dart';
import 'package:mzizi_api/src/models/insights/party_detail_party.dart';
import 'package:mzizi_api/src/models/insights/party_detail_results.dart';

part 'party_detail.g.dart';

/// Party Detail
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetail {
  const InsightsPartyDetail({required this.funding, required this.gaps, required this.members, required this.party, required this.results});
  final List<InsightsPartyDetailFunding> funding;
  final List<String> gaps;
  final List<InsightsPartyDetailMembers> members;
  final InsightsPartyDetailParty party;
  final List<InsightsPartyDetailResults> results;

  factory InsightsPartyDetail.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailToJson(this);
}
