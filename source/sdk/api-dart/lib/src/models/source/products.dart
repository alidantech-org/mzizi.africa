import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';

part 'products.g.dart';

/// One logical document or dataset, independent of who served it, in what format or how many times it was downloaded.
@JsonSerializable(includeIfNull: false)
class SourceProducts {
  const SourceProducts({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.kindId,
    this.publisherId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String kindId;
  final String? publisherId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceProducts.fromJson(Map<String, dynamic> json) => _$SourceProductsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceProductsToJson(this);
}
