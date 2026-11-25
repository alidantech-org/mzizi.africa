import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'choices.g.dart';

/// A referendum choice (yes, no).
@JsonSerializable(includeIfNull: false)
class ElectionChoices {
  const ElectionChoices({
    required this.ballotOrder,
    required this.code,
    required this.contestId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final int ballotOrder;
  final String code;
  final String contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory ElectionChoices.fromJson(Map<String, dynamic> json) => _$ElectionChoicesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionChoicesToJson(this);
}
