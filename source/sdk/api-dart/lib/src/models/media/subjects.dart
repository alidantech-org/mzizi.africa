import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'subjects.g.dart';

/// The named things an article is about, beyond its main identity (section 34.5).
@JsonSerializable(includeIfNull: false)
class MediaSubjects {
  const MediaSubjects({
    required this.articleId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityId,
    required this.roleTerm,
  });
  final String articleId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String identityId;
  final String roleTerm;

  factory MediaSubjects.fromJson(Map<String, dynamic> json) => _$MediaSubjectsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaSubjectsToJson(this);
}
