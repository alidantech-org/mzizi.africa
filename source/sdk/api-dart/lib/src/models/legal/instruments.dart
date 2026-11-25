import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/jurisdictions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'instruments.g.dart';

/// A legal instrument (the Constitution of Kenya 2010, an Act). Its titles are `identity.names`.
@JsonSerializable(includeIfNull: false)
class LegalInstruments {
  const LegalInstruments({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.enactedOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    this.issuerId,
    this.jurisdictionId,
    required this.kindTerm,
    this.publishedOn,
    this.statusTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? enactedOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String? issuerId;
  final String? jurisdictionId;
  final String kindTerm;
  final DateTime? publishedOn;
  final String? statusTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory LegalInstruments.fromJson(Map<String, dynamic> json) => _$LegalInstrumentsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentsToJson(this);
}
