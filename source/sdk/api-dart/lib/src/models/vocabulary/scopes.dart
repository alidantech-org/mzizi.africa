import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/schemes.dart';

part 'scopes.g.dart';

/// Which kinds of named thing a scheme may classify.
@JsonSerializable(includeIfNull: false)
class VocabularyScopes {
  const VocabularyScopes({required this.createdAt, this.deletedAt, required this.id, required this.identityKind, required this.schemeId});
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String schemeId;

  factory VocabularyScopes.fromJson(Map<String, dynamic> json) => _$VocabularyScopesFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyScopesToJson(this);
}
