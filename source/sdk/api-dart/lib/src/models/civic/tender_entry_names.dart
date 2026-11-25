import 'package:json_annotation/json_annotation.dart';

part 'tender_entry_names.g.dart';

/// Tender Entry Names
@JsonSerializable(includeIfNull: false)
class CivicTenderEntryNames {
  const CivicTenderEntryNames({
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

  factory CivicTenderEntryNames.fromJson(Map<String, dynamic> json) => _$CivicTenderEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderEntryNamesToJson(this);
}
