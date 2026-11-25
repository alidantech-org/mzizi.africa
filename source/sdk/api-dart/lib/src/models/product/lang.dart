import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/product/releases.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'lang.g.dart';

/// The languages a release offers, in order.
@JsonSerializable(includeIfNull: false)
class ProductLang {
  const ProductLang({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.position,
    required this.releaseId,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final int position;
  final String releaseId;

  factory ProductLang.fromJson(Map<String, dynamic> json) => _$ProductLangFromJson(json);

  Map<String, dynamic> toJson() => _$ProductLangToJson(this);
}
