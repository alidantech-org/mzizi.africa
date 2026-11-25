import 'package:json_annotation/json_annotation.dart';

part 'currency_entry_names.g.dart';

/// Currency Entry Names
@JsonSerializable(includeIfNull: false)
class ReferenceCurrencyEntryNames {
  const ReferenceCurrencyEntryNames({
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

  factory ReferenceCurrencyEntryNames.fromJson(Map<String, dynamic> json) => _$ReferenceCurrencyEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCurrencyEntryNamesToJson(this);
}
