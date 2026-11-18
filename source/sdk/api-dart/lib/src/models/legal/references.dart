import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/reference_method.dart';
import 'package:mzizi_api/src/enums/legal/reference_relation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/legal/translations.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'references.g.dart';

/// A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment.
@JsonSerializable(includeIfNull: false)
class LegalReferences {
  const LegalReferences({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.method,
    required this.relation,
    required this.reviewStatus,
    required this.spanEnd,
    required this.spanStart,
    required this.spanText,
    required this.targetProvisionId,
    this.targetWordingId,
    this.translationId,
    required this.updatedAt,
    required this.version,
    this.wordingId,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final LegalReferenceMethod method;
  final LegalReferenceRelation relation;
  final LegalReviewStatus reviewStatus;
  final int spanEnd;
  final int spanStart;
  final String spanText;
  final String targetProvisionId;
  final String? targetWordingId;
  final String? translationId;
  final DateTime updatedAt;
  final int version;
  final String? wordingId;

  factory LegalReferences.fromJson(Map<String, dynamic> json) => _$LegalReferencesFromJson(json);

  Map<String, dynamic> toJson() => _$LegalReferencesToJson(this);
}
