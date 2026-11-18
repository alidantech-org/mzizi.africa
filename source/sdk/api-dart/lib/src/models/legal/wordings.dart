import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/legal/editions.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'wordings.g.dart';

/// Exact authority-bearing text of one provision in one edition and language. Translations are separate rows.
@JsonSerializable(includeIfNull: false)
class LegalWordings {
  const LegalWordings({
    this.citationId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.editionId,
    this.endsOn,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.instrumentId,
    required this.languageId,
    required this.observedAt,
    required this.provisionId,
    this.startsOn,
    this.supersedesId,
    required this.text,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? citationId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String editionId;
  final DateTime? endsOn;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String instrumentId;
  final String languageId;
  final DateTime observedAt;
  final String provisionId;
  final DateTime? startsOn;
  final String? supersedesId;
  final String text;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory LegalWordings.fromJson(Map<String, dynamic> json) => _$LegalWordingsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalWordingsToJson(this);
}
