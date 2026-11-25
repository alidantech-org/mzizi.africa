import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'articles.g.dart';

/// An article record with no text; its texts per language are `media.texts`.
@JsonSerializable(includeIfNull: false)
class MediaArticles {
  const MediaArticles({
    this.authorId,
    required this.categoryTerm,
    required this.code,
    this.contributorId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.identityId,
    this.publishedAt,
    required this.updatedAt,
    required this.version,
  });
  final String? authorId;
  final String categoryTerm;
  final String code;
  final String? contributorId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? identityId;
  final DateTime? publishedAt;
  final DateTime updatedAt;
  final int version;

  factory MediaArticles.fromJson(Map<String, dynamic> json) => _$MediaArticlesFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticlesToJson(this);
}
