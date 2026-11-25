import 'package:json_annotation/json_annotation.dart';

part 'bill_entry_names.g.dart';

/// Bill Entry Names
@JsonSerializable(includeIfNull: false)
class LegislatureBillEntryNames {
  const LegislatureBillEntryNames({
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

  factory LegislatureBillEntryNames.fromJson(Map<String, dynamic> json) => _$LegislatureBillEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillEntryNamesToJson(this);
}
