import 'package:json_annotation/json_annotation.dart';

part 'party_detail.g.dart';

/// Party Detail
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetail {
  const InsightsPartyDetail({required this.funding, required this.gaps, required this.members, required this.party, required this.results});
  final List<Object?> funding;
  final List<String> gaps;
  final List<Object?> members;
  final Object? party;
  final List<Object?> results;

  factory InsightsPartyDetail.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailToJson(this);
}
