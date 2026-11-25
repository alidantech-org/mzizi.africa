import 'package:json_annotation/json_annotation.dart';

part 'election_detail_names.g.dart';

/// Election Detail Names
@JsonSerializable(includeIfNull: false)
class ElectionElectionDetailNames {
  const ElectionElectionDetailNames({
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

  factory ElectionElectionDetailNames.fromJson(Map<String, dynamic> json) => _$ElectionElectionDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionDetailNamesToJson(this);
}
