import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/politics/party_detail_coalitions.dart';
import 'package:mzizi_api/src/models/politics/party_detail_names.dart';

part 'party_detail.g.dart';

/// Party Detail
@JsonSerializable(includeIfNull: false)
class PoliticsPartyDetail {
  const PoliticsPartyDetail({
    required this.coalitions,
    required this.code,
    required this.countryId,
    this.fromYear,
    required this.kindTerm,
    required this.names,
    required this.partyId,
    this.toYear,
  });
  final List<PoliticsPartyDetailCoalitions> coalitions;
  final String code;
  final String countryId;
  final int? fromYear;
  final String kindTerm;
  final List<PoliticsPartyDetailNames> names;
  final String partyId;
  final int? toYear;

  factory PoliticsPartyDetail.fromJson(Map<String, dynamic> json) => _$PoliticsPartyDetailFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyDetailToJson(this);
}
