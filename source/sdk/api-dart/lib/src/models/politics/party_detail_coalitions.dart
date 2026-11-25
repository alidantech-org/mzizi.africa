import 'package:json_annotation/json_annotation.dart';

part 'party_detail_coalitions.g.dart';

/// Party Detail Coalitions
@JsonSerializable(includeIfNull: false)
class PoliticsPartyDetailCoalitions {
  const PoliticsPartyDetailCoalitions({required this.coalitionId, required this.code, this.fromYear, required this.kindTerm, this.toYear});
  final String coalitionId;
  final String code;
  final int? fromYear;
  final String kindTerm;
  final int? toYear;

  factory PoliticsPartyDetailCoalitions.fromJson(Map<String, dynamic> json) => _$PoliticsPartyDetailCoalitionsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyDetailCoalitionsToJson(this);
}
