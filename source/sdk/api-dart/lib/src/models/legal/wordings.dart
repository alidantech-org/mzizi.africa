import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/editions.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'wordings.g.dart';

/// The official text of a provision in one edition and language.
@JsonSerializable(includeIfNull: false)
class LegalWordings {
  const LegalWordings({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.editionId,
    this.endsOn,
    this.heading,
    required this.id,
    required this.languageId,
    required this.provisionId,
    this.startsOn,
    this.supersedesId,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String editionId;
  final DateTime? endsOn;
  final String? heading;
  final String id;
  final String languageId;
  final String provisionId;
  final DateTime? startsOn;
  final String? supersedesId;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory LegalWordings.fromJson(Map<String, dynamic> json) => _$LegalWordingsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalWordingsToJson(this);
}
