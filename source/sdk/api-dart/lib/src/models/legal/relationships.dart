import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'relationships.g.dart';

/// An amendment, repeal or replacement between instruments or wordings.
@JsonSerializable(includeIfNull: false)
class LegalRelationships {
  const LegalRelationships({
    this.affectedWordingId,
    this.authorityWordingId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    required this.id,
    required this.kindTerm,
    this.note,
    this.noteLanguageId,
    this.objectInstrumentId,
    this.resultingWordingId,
    this.subjectInstrumentId,
    required this.updatedAt,
    required this.version,
  });
  final String? affectedWordingId;
  final String? authorityWordingId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? effectiveOn;
  final String id;
  final String kindTerm;
  final String? note;
  final String? noteLanguageId;
  final String? objectInstrumentId;
  final String? resultingWordingId;
  final String? subjectInstrumentId;
  final DateTime updatedAt;
  final int version;

  factory LegalRelationships.fromJson(Map<String, dynamic> json) => _$LegalRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalRelationshipsToJson(this);
}
