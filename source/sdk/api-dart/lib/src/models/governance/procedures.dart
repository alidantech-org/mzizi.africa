import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'procedures.g.dart';

/// A procedure law sets out; its explanation is a definition name or a media article.
@JsonSerializable(includeIfNull: false)
class GovernanceProcedures {
  const GovernanceProcedures({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.provisionId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? provisionId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceProcedures.fromJson(Map<String, dynamic> json) => _$GovernanceProceduresFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceProceduresToJson(this);
}
