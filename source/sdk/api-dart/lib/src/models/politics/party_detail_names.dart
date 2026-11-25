import 'package:json_annotation/json_annotation.dart';

part 'party_detail_names.g.dart';

/// Party Detail Names
@JsonSerializable(includeIfNull: false)
class PoliticsPartyDetailNames {
  const PoliticsPartyDetailNames({
    this.fromYear,
    required this.isDefault,
    required this.kindTerm,
    required this.languageCode,
    this.languageIso,
    required this.text,
    this.toYear,
  });
  final int? fromYear;
  final bool isDefault;
  final String kindTerm;
  final String languageCode;
  final String? languageIso;
  final String text;
  final int? toYear;

  factory PoliticsPartyDetailNames.fromJson(Map<String, dynamic> json) => _$PoliticsPartyDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyDetailNamesToJson(this);
}
