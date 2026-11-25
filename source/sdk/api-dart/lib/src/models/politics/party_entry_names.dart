import 'package:json_annotation/json_annotation.dart';

part 'party_entry_names.g.dart';

/// Party Entry Names
@JsonSerializable(includeIfNull: false)
class PoliticsPartyEntryNames {
  const PoliticsPartyEntryNames({
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

  factory PoliticsPartyEntryNames.fromJson(Map<String, dynamic> json) => _$PoliticsPartyEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyEntryNamesToJson(this);
}
