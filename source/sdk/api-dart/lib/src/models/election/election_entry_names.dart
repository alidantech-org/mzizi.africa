import 'package:json_annotation/json_annotation.dart';

part 'election_entry_names.g.dart';

/// Election Entry Names
@JsonSerializable(includeIfNull: false)
class ElectionElectionEntryNames {
  const ElectionElectionEntryNames({
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

  factory ElectionElectionEntryNames.fromJson(Map<String, dynamic> json) => _$ElectionElectionEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionEntryNamesToJson(this);
}
