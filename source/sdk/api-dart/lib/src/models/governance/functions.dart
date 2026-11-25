import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'functions.g.dart';

/// A government function (county health services) from law, possibly under a broader one.
@JsonSerializable(includeIfNull: false)
class GovernanceFunctions {
  const GovernanceFunctions({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    this.parentId,
    this.provisionId,
    required this.topicTerm,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String? parentId;
  final String? provisionId;
  final String topicTerm;
  final DateTime updatedAt;
  final int version;

  factory GovernanceFunctions.fromJson(Map<String, dynamic> json) => _$GovernanceFunctionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceFunctionsToJson(this);
}
